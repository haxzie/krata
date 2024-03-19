import { timeAgo } from "@/utils/DateFormatter";

export const PROJECT_ACCESS = {
  READ: "READ",
  WRITE: "WRITE",
  OWNER: "OWNER"
}
export default class Project {
  constructor({
    _id,
    title,
    description,
    state,
    featureIds,
    features,
    createdBy,
    isArchived,
    lastOpenedAt,
    createdAt,
    updatedAt,
    cover,
  }) {
    this.id = _id;
    this.title = title;
    this.description = description;
    this.state = state;
    this.featureIds = featureIds;
    this.features = features;
    this.createdBy = createdBy;
    this.isArchived = isArchived;
    this.lastOpenedAt = lastOpenedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.cover = cover;
    this._createdAt = timeAgo(createdAt);
    this._lastOpenedAt = timeAgo(lastOpenedAt);
    this._updatedAt = timeAgo(updatedAt);
  }
}
