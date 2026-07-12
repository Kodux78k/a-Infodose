

import os

from twilio.rest import Client



class TwilioClient:


    def __init__(self):

        self.client = Client(

            os.getenv(
            "TWILIO_ACCOUNT_SID"
            ),

            os.getenv(
            "TWILIO_AUTH_TOKEN"
            )

        )



    def send_message(
    self,
    to,
    body
    ):


        return self.client.messages.create(

            from_=os.getenv(
            "TWILIO_WHATSAPP_NUMBER"
            ),

            body=body,

            to=to

        )


