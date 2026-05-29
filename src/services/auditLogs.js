import api from "./api";

export async function fetchBookActionLogs(book_id, page = 1) {
    let data = await api.get(`/audit/logs/book_logs/`, { params: { book_id } })
    return data

    // example return data: 
    // [
    //   {
    //     "id": 775,
    //     "user": 1,
    //     "user_username": "xe",
    //     "action": "UPDATE",
    //     "action_display": "Update",
    //     "model_name": "kitob",
    //     "object_id": 368,
    //     "description": "UPDATE kitob: test kitob updated Чингиз Айтматов",
    //     "changes": {
    //       "u_at": {
    //         "old": "2026-05-13 06:11:00.273348+00:00",
    //         "new": "2026-05-13 06:12:01.917626+00:00"
    //       },
    //       "name": {
    //         "old": "test kitob",
    //         "new": "test kitob updated"
    //       },
    //       "sortingname": {
    //         "old": "test kitob",
    //         "new": "test kitob updated"
    //       },
    //       "quantity": {
    //         "old": "242",
    //         "new": "24"
    //       },
    //       "description": {
    //         "old": "A.G’. Ahmedov, Odam anatomiyasi: Tibbiyot institutlarining bakalavriat yo’nalishidagi talabalari uchun darslik / A.G’.Ahmedov; O’zbekiston Reaspublikasi Oliy va o’rta maxsus ta’lim vazirligi, O’zbekiston Respublikasi sog’liqni saqlash vazirligi. -T.: “IQTISOD-MOLIYA”, 2007. 444b",
    //         "new": "A.G’. Ahmedov, Odam anatomiyasi: Tibbiyot institutlarining bakalavriat yo’nalishidagi talabalari uchun darslik / A.G’.Ahmedov; O’zbekiston Reaspublikasi Oliy va o’rta maxsus ta’lim vazirligi, O’zbekiston Respublikasi sog’liqni saqlash vazirligi. -T.: “IQTISOD-MOLIYA”, 2007. 444b\r\n\r\newoiteiwgigheiurhwieurgitwghi1eur2gwurhipe"
    //       },
    //       "sortingdiscription": {
    //         "old": "a.g’. ahmedov, odam anatomiyasi: tibbiyot institutlarining bakalavriat yo’nalishidagi talabalari uchun darslik / a.g’.ahmedov; o’zbekiston reaspublikasi oliy va o’rta maxsus ta’lim vazirligi, o’zbekiston respublikasi sog’liqni saqlash vazirligi. -t.: “iqtisod-moliya”, 2007. 444b",
    //         "new": "a.g’. ahmedov, odam anatomiyasi: tibbiyot institutlarining bakalavriat yo’nalishidagi talabalari uchun darslik / a.g’.ahmedov; o’zbekiston reaspublikasi oliy va o’rta maxsus ta’lim vazirligi, o’zbekiston respublikasi sog’liqni saqlash vazirligi. -t.: “iqtisod-moliya”, 2007. 444b\r\n\r\newoiteiwgigheiurhwieurgitwghi1eur2gwurhipe"
    //       },
    //       "pages": {
    //         "old": "23",
    //         "new": "233"
    //       }
    //     },
    //     "ip_address": "144.124.192.99",
    //     "user_agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    //     "timestamp": "2026-05-13T11:12:01.937448+05:00"
    //   },
    //   {
    //     "id": 774,
    //     "user": 1,
    //     "user_username": "xe",
    //     "action": "CREATE",
    //     "action_display": "Create",
    //     "model_name": "kitob",
    //     "object_id": 368,
    //     "description": "CREATE kitob: test kitob ",
    //     "changes": {},
    //     "ip_address": "144.124.192.99",
    //     "user_agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    //     "timestamp": "2026-05-13T11:11:00.291793+05:00"
    //   }
    // ]
}

export async function fetchUserActionHistory(user_id, page = 1) {
    let data = await api.get(`/audit/logs/book_logs/`, { params: { user_id, page } })
    return data

    // example return data

    //     [
    //   {
    //     "id": 776,
    //     "user": 1,
    //     "user_username": "xe",
    //     "action": "CREATE",
    //     "action_display": "Create",
    //     "model_name": "kitob",
    //     "object_id": 369,
    //     "description": "CREATE kitob: test kitob 2 ",
    //     "changes": {},
    //     "ip_address": "144.124.192.99",
    //     "user_agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    //     "timestamp": "2026-05-13T11:16:36.260386+05:00"
    //   },
    //   {
    //     "id": 775,
    //     "user": 1,
    //     "user_username": "xe",
    //     "action": "UPDATE",
    //     "action_display": "Update",
    //     "model_name": "kitob",
    //     "object_id": 368,
    //     "description": "UPDATE kitob: test kitob updated Чингиз Айтматов",
    //     "changes": {
    //       "u_at": {
    //         "old": "2026-05-13 06:11:00.273348+00:00",
    //         "new": "2026-05-13 06:12:01.917626+00:00"
    //       },
    //       "name": {
    //         "old": "test kitob",
    //         "new": "test kitob updated"
    //       },
    //       "sortingname": {
    //         "old": "test kitob",
    //         "new": "test kitob updated"
    //       },
    //       "quantity": {
    //         "old": "242",
    //         "new": "24"
    //       },
    //       "description": {
    //         "old": "A.G’. Ahmedov, Odam anatomiyasi: Tibbiyot institutlarining bakalavriat yo’nalishidagi talabalari uchun darslik / A.G’.Ahmedov; O’zbekiston Reaspublikasi Oliy va o’rta maxsus ta’lim vazirligi, O’zbekiston Respublikasi sog’liqni saqlash vazirligi. -T.: “IQTISOD-MOLIYA”, 2007. 444b",
    //         "new": "A.G’. Ahmedov, Odam anatomiyasi: Tibbiyot institutlarining bakalavriat yo’nalishidagi talabalari uchun darslik / A.G’.Ahmedov; O’zbekiston Reaspublikasi Oliy va o’rta maxsus ta’lim vazirligi, O’zbekiston Respublikasi sog’liqni saqlash vazirligi. -T.: “IQTISOD-MOLIYA”, 2007. 444b\r\n\r\newoiteiwgigheiurhwieurgitwghi1eur2gwurhipe"
    //       },
    //       "sortingdiscription": {
    //         "old": "a.g’. ahmedov, odam anatomiyasi: tibbiyot institutlarining bakalavriat yo’nalishidagi talabalari uchun darslik / a.g’.ahmedov; o’zbekiston reaspublikasi oliy va o’rta maxsus ta’lim vazirligi, o’zbekiston respublikasi sog’liqni saqlash vazirligi. -t.: “iqtisod-moliya”, 2007. 444b",
    //         "new": "a.g’. ahmedov, odam anatomiyasi: tibbiyot institutlarining bakalavriat yo’nalishidagi talabalari uchun darslik / a.g’.ahmedov; o’zbekiston reaspublikasi oliy va o’rta maxsus ta’lim vazirligi, o’zbekiston respublikasi sog’liqni saqlash vazirligi. -t.: “iqtisod-moliya”, 2007. 444b\r\n\r\newoiteiwgigheiurhwieurgitwghi1eur2gwurhipe"
    //       },
    //       "pages": {
    //         "old": "23",
    //         "new": "233"
    //       }
    //     },
    //     "ip_address": "144.124.192.99",
    //     "user_agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    //     "timestamp": "2026-05-13T11:12:01.937448+05:00"
    //   },
    //   {
    //     "id": 774,
    //     "user": 1,
    //     "user_username": "xe",
    //     "action": "CREATE",
    //     "action_display": "Create",
    //     "model_name": "kitob",
    //     "object_id": 368,
    //     "description": "CREATE kitob: test kitob ",
    //     "changes": {},
    //     "ip_address": "144.124.192.99",
    //     "user_agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
    //     "timestamp": "2026-05-13T11:11:00.291793+05:00"
    //   }
    // ]
}



export async function fetchFullLogData(log_id) {
    let data = await api.get(`/audit/logs/${log_id}/`)
    return data

    // example return data

    // {
    //   "id": 0,
    //   "user": 0,
    //   "user_username": "string",
    //   "action": "CREATE",
    //   "action_display": "string",
    //   "model_name": "string",
    //   "object_id": 0,
    //   "description": "string",
    //   "changes": "string",
    //   "ip_address": "string",
    //   "user_agent": "string",
    //   "timestamp": "2026-05-29T13:56:46.262Z",
    //   "user_fname": "string",
    //   "user_lname": "string"
    // }
}


export async function fetchMyAuditLogs() {
    let data = await api.get(`/audit/logs/my_actions/`)
    return data

    // example return data

    // {
    //   "id": 0,
    //   "user": 0,
    //   "user_username": "string",
    //   "action": "CREATE",
    //   "action_display": "string",
    //   "model_name": "string",
    //   "object_id": 0,
    //   "description": "string",
    //   "changes": "string",
    //   "ip_address": "string",
    //   "user_agent": "string",
    //   "timestamp": "2026-05-29T14:13:14.572Z",
    //   "user_fname": "string",
    //   "user_lname": "string"
    // }
}