

import os


required=[

"core/kobllux_core.py",

"engine/motor_369.py",

"boot/bootloader.py"

]


for item in required:

    if os.path.exists(item):

        print(
        "OK",
        item
        )

    else:

        print(
        "MISSING",
        item
        )


