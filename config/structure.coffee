# Read more about app structure at http://docs.appgyver.com

module.exports =


  initialView:
     id: "initialView"
     location: "rental#login"
  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css
  tabs: [
    {
      title: "Home"
      id: "index"
      location: "rental#search" # Supersonic module#view type navigation
    }
    {
      title: "My Rentals"
      id: "inbox"
      location: "rental#myRentals" # URLs are supported!
    }
    {
      title: "My Account"
      id: "person"
      location: "rental#myAccount"
    }
  ]

  # rootView:
  #   location: "example#getting-started"

  preloads: [
    {
      id: "learn-more"
      location: "example#learn-more"
    }
    {
      id: "using-the-scanner"
      location: "example#using-the-scanner"
    }
  ]

  # drawers:
  #   left:
  #     id: "leftDrawer"
  #     location: "example#drawer"
  #     showOnAppLoad: false
  #   options:
  #     animation: "swingingDoor"
  #
