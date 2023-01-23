import { Container, TimePicker, TimePickerHeader, TimePickerItem, TimePickerList } from "./styles";
import { Calendar } from "../../../../../components/Calendar";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../../../../../lib/axios";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

interface Availability {
    possibleTimes: number[]
    availableTime: number[]
}


export function CalendarStep() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    //const [availability, setAvailability] = useState<Availability | null>(null)

    const router = useRouter()

    const username = String(router.query.username)

    const isDateSelected = !!selectedDate

    const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null

    const describedDate = selectedDate ? dayjs(selectedDate).format('DD[ de ]MMMM') : null

    const selectedDateWithoutTime = selectedDate ?  dayjs(selectedDate).format('YYYY-MM-DD') : null

    const {data: availability} = useQuery<Availability>(['availability', selectedDateWithoutTime], async () => {
        const response = await api.get(`/users/${username}/availability`, {
            params: {
                date: dayjs(selectedDate).format('YYYY-MM-DD')
            },
        })
        return response.data
    },

        {
            enabled: !!selectedDate,
        },

)    

    // useEffect(() => {
    //     if (!selectedDate) {
    //         return 
    // //     }

        
    //     }).then(response => {
    //         setAvailability(response.data)
    //   

    // },[selectedDate, username])

    return (
        <Container isTimePickerOpen={isDateSelected}>
            <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

            {isDateSelected && (
                <TimePicker>
                    <TimePickerHeader>
                        {weekDay} <span>{describedDate}</span>
                    </TimePickerHeader>

                    <TimePickerList>
                        {
                            availability?.possibleTimes.map((hour) => {
                                return (
                                    <TimePickerItem 
                                     key={hour} 
                                    //  disabled={!availability.availableTime.includes(hour)}
                                    >
                                        {String(hour).padStart(2, '0')}:00h
                                    </TimePickerItem>
                                )
                            })
                        }
                      
                    </TimePickerList>
                </TimePicker>
            )}
        </Container>
    )
}