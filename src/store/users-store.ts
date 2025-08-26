import { UserType } from "@/types/user";
import { create } from "zustand";

interface UsersStore {
    loggedInUserData: UserType | null;
    setLoggedInUserData: (user: UserType) => void;
}

const useUsersStore = create<UsersStore>((set) => ({
    loggedInUserData: null,
    setLoggedInUserData: (user) => set({ loggedInUserData: user }),
}));

export default useUsersStore;