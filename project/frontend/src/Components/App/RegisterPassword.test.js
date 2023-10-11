import {render, screen} from '@testing-library/react';
import selectEvent from 'react-select-event';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils'
import App from './App';

test('Enforces password constraints', async () => {
    
    render(<App />);
    await act( async() => {await userEvent.click(screen.getByText("Sign Up"));});
    await userEvent.type(screen.getByRole("textbox", { name: "Name:"}), "Test User");
    await userEvent.type(screen.getByRole("textbox", { name: "Username:"}), "testdummy1");
    await userEvent.type(screen.getByLabelText("Password:"), "fail");
    await userEvent.type(screen.getByLabelText("Retype Password:"), "fail");
    await userEvent.click(screen.getByRole("button"));
    const el = await screen.getByText(/Password must be:/);
    expect(el).toBeInTheDocument();
});