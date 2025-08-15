export interface ExampleComponentProps {
    title: string;
    description?: string;
}

export interface AppState {
    isLoggedIn: boolean;
    user: string | null;
}