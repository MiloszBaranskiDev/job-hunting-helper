import { OperationState } from '@jhh/jhh-client/dashboard/domain';

export function ResetOperationStateError(
  state: OperationState
): OperationState {
  return { ...state, error: null };
}
