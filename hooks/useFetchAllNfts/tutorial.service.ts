import http from "./http-common";

class TutorialDataService {
  getAll() {
    return http.get("/characters");
  }

  getWhaleActivity() {
    return http.get("/whaleActivity");
  }

  getHolderVerify(id: any) {
    return http.get(`/holderVerify/${id}`);
  }
}

export default new TutorialDataService();