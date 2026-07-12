class KoblluxAvatar {


  constructor() {

    this.state = "idle";


  }



  pulse() {


    this.state = "active";


    document
    .getElementById(
      "avatar"
    )
    .innerHTML = "🌀💠";


  }



}


window.avatar =
new KoblluxAvatar();