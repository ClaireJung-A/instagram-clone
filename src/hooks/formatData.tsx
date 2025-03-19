import { Post } from "../screens/FriendProfileAndroid";

interface EmptyPostType extends Post {
  key: string;
  empty: true;
}

const useFormatData = () => {
  const formatData = (data: Post[], numColumns: number): (Post | EmptyPostType)[] => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      const emptyPost: EmptyPostType = {
        key: `blank-${numberOfElementsLastRow}`,
        empty: true,
      } as unknown as EmptyPostType;

      data.push(emptyPost);
      numberOfElementsLastRow++;
    }

    return data;
  };

  return formatData;
};

export default useFormatData;
