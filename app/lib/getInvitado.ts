import { invitados } from "./invitados";
import { Invitado } from "../types/invitado";

export function getInvitadoById(id: string): Invitado | undefined {
  const normalizedId = decodeURIComponent(id).toLowerCase().trim();

  return invitados.find((inv) => inv.id.toLowerCase().trim() === normalizedId);
}
