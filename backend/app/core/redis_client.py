import redis

try:
    redis_client = redis.Redis(
        # host="localhost",
        host="127.0.0.1",
        port=6379,
        decode_responses=True
    )

    redis_client.ping()

    print("Redis Connected Successfully")

except Exception:

    print("Redis Not Available")

    redis_client = None