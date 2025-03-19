import { ImageSourcePropType } from "react-native";

export interface User {
  user: string;
  image: ImageSourcePropType; 
}


export const USERS: User[] = [
    {
      user: "lg_uplus",
      image: require("../.././assets/users/image1.jpg"),
    },
    {
      user: "kim_love_jin",
      image: require("../.././assets/users/image2.jpg"),
    },
    {
      user: "time.sleep",
      image: require("../.././assets/users/image3.jpg"),
    },
    {
      user: "dokkeryay",
      image: require("../.././assets/users/image4.jpg"),
    },
    {
      user: "Stephanieee",
      image: require("../.././assets/users/image5.jpg"),
    },
    {
      user: "z_nooobie",
      image: require("../.././assets/users/image6.jpg"),
    },
    {
      user: "zyr.bklz",
      image: require("../.././assets/users/image7.jpg"),
    },
    {
      user: "alyssaaa",
      image: require("../.././assets/users/image8.jpg"),
    },
  ];