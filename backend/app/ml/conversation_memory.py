import chromadb
import uuid
from sentence_transformers import (
    SentenceTransformer
)


class ConversationMemory:

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path="./memory_db"
        )

        self.collection = (
            self.client.get_or_create_collection(
                name="farmer_memory"
            )
        )

        self.embedding_model = (
            SentenceTransformer(
                "all-MiniLM-L6-v2"
            )
        )

    # =========================
    # Store Conversation
    # =========================

    def store_conversation(
        self,
        retailer_id,
        question,
        response
    ):

        text = (
            f"Question: {question}\n"
            f"Response: {response}"
        )

        embedding = (
            self.embedding_model.encode(text)
            .tolist()
        )

        self.collection.add(

            documents=[text],

            embeddings=[embedding],

            metadatas=[
                {
                    "retailer_id": retailer_id
                }
            ],

            ids=[
                str(uuid.uuid4())
            ]
        )

    # =========================
    # Retrieve Memory
    # =========================

    def retrieve_memory(
        self,
        retailer_id,
        query,
        top_k=2
    ):

        query_embedding = (
            self.embedding_model.encode(query)
            .tolist()
        )

        results = self.collection.query(

            query_embeddings=[
                query_embedding
            ],

            n_results=top_k,

            where={
                "retailer_id": retailer_id
            }
        )

        if (
            not results["documents"]
            or not results["documents"][0]
        ):
            return []

        cleaned_memories = []

        seen = set()

        for doc in results["documents"][0]:

            question_part = (
                doc.split("\n")[0]
                .replace("Question: ", "")
            )

            if question_part not in seen:

                cleaned_memories.append(
                    question_part
                )

                seen.add(question_part)

        return cleaned_memories