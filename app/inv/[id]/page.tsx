import { notFound } from "next/navigation";
import { getInvitadoById } from "@/lib/getInvitado";
import InvitacionClient from "./InvitacionClient";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function InvitacionPage({ params }: Props) {
  const { id } = await params;

  const invitado = getInvitadoById(id);

  if (!invitado) {
    notFound();
  }

  return <InvitacionClient invitado={invitado} />;
}
