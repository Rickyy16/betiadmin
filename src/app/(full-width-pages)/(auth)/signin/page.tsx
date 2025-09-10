import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page | BetiAdmin",
  description: "This is Signin Page BetiAdmin Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
