import http from "./http-common";

class TutorialDataService {
  getAll(id: any) {
    return http.get(`/characters/${id}`);
  }
}

export default new TutorialDataService();