import { useClerk } from "@clerk/react-router";
import { useParams } from "react-router";

export default function Login() {
  const params = useParams();
  const { redirectToSignIn } = useClerk();

  redirectToSignIn({ redirectUrl: params.url ?? "/" });

  return <></>;
}
