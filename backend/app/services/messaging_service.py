# from twilio.rest import Client
# import os

# client = Client(
#     os.getenv("TWILIO_ACCOUNT_SID"),
#     os.getenv("TWILIO_AUTH_TOKEN")
# )

# def send_whatsapp(phone, message):
#     return client.messages.create(
#         from_=os.getenv("TWILIO_WHATSAPP_NUMBER"),
#         to=f"whatsapp:{phone}",
#         body=message
#     )

# app/services/messaging_service.py

def send_whatsapp(phone, message):

    print("=" * 50)
    print("WHATSAPP MESSAGE SENT")
    print(f"To: {phone}")
    print(f"Message: {message}")
    print("=" * 50)

    return {
        "status": "sent",
        "provider": "prototype",
        "phone": phone,
        "message": message
    }