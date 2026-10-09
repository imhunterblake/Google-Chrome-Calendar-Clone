import { Calendar } from "./components/Calendar/Calendar"
import { EventsProvider } from "./context/EventsProvider"

export default function App() {
  return (
    <EventsProvider>
      <Calendar />
    </EventsProvider>
  )
}
