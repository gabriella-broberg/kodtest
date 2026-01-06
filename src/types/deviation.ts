export interface ObjectIcon {
  id: number
  url: string
  name: string
}

export interface Deviation {
  id: number
  name: string
  status: 'rejected' | 'resolved'
  statusName: string
  createdAtUtc: string
  updatedAtUtc: string
  updatedByUser: string
  updatedByUserId: number
  priority: 'low' | 'medium' | 'high'
  responsibleUserId: number | null
  responsibleUser: string | null
  isDeleted: boolean
  roomName: string
  roomId: number
  levelName: string
  levelId: number
  buildingName: string
  buildingId: number
  propertyName: string
  propertyId: number
  inspectionType: string
  objectName: string
  objectType: string
  objectId: number
  objectIcon: ObjectIcon
}

