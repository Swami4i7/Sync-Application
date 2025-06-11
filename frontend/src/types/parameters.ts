export interface Parameters {
PARAM_ID: number
  SCHEDULE_ID: number
  PARAM_NAME: string
  PARAM_VALUE: string
  SEQUENCE_NO: number
  NEXT_SCHEDULE_TIME: string
  NEXT_SCHEDULE_TIME_TEMP: string
  CREATED_BY: string
  CREATION_DATE: string
  LAST_UPDATED_BY: string
  LAST_UPDATE_DATE: string
}

export type saveParametersType = {
  create?: Parameters[],
  update?: Parameters[],
  delete?: number[]
}