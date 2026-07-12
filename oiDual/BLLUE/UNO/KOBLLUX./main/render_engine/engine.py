

from jinja2 import Template



class RenderEngine:



    def render(
        self,
        data
    ):


        template=Template(

"""

<div class='kobllux-card'>

<h2>🌀 {{title}}</h2>

<p>{{content}}</p>

<div>

💠 Núcleo ativo

</div>

</div>

"""

        )


        return template.render(

            title="KOBLLUX",

            content=data

        )



