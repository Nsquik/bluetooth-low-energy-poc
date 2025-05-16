export type InfoActionProps = {
  message: string;
  action: {
    text: string;
    onPress: () => void;
  };
};
