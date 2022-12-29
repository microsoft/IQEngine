import { RETURN_META_DATA_BLOB } from "../../Constants/MetaTypes";
import { FetchMeta } from "../../Sources/FetchMetaSource";

export const returnMetaDataBlob = payload => ({
    type: RETURN_META_DATA_BLOB,
    payload,
})

export const fetchMetaDataBlob = connection => FetchMeta(connection);