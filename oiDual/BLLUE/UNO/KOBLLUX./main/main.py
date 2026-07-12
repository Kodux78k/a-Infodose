

from core.kobllux_core import KoblluxCore
from engine.motor_369 import Motor369


core=KoblluxCore()

motor=Motor369()


motor.collect(
core.pulse()
)


print(
motor.organize()
)


