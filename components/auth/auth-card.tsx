import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import BackButton from "./back-button";
import Socials from "./socials";
type CardWrapperProps = {
  children: React.ReactNode;
  cardTitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSpcials?: boolean;
};
export default function AuthCard({
  children,
  cardTitle,
  backButtonHref,
  backButtonLabel,
  showSpcials,
}: CardWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSpcials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
}
