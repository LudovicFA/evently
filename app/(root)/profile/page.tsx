import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async ({searchParams}: SearchParamProps) => {

    const {sessionClaims} = auth()
    const userId = sessionClaims?.userId as string

    const ordersPage = Number(searchParams?.ordersPage) || 1;
    const eventsPage = Number(searchParams?.eventsPage) || 1;

    const organizedEvent = await getEventsByUser({userId, page: eventsPage})
    const orders = await getOrdersByUser({userId, page: ordersPage})
    const orderedEvent = orders?.data.map((order: IOrder) => order.event) || []

  return (
    <>
    {/* My Tickets */}

    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <div className='wrapper flex items-center justify-center sm:justify-between'>
            <h3 className='h3-bold text-center sm:text-left'>My Tickets</h3>
            <Button asChild size='lg' className='button hidden sm:flex'>
                <Link href="/#events">
                    Explore more events
                </Link>
            </Button>
        </div>
    </section>

    <section className='wrapper my-8'>
    <Collection
          data={orderedEvent}
          emptyTitle='No event tickets purchased yet'
          emptyStateSubtext="No worries - plenty of exciting events to explore ! "
          collectionType='My_Tickets'
          limit={3}
          page={ordersPage}
          urlParamName='ordersPage'
          totalPages={orders?.totalPages}
        />
    </section>

    {/* Event Organized */}
    <section className='bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10'>
        <div className='wrapper flex items-center justify-center sm:justify-between'>
            <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
            <Button asChild size='lg' className='button hidden sm:flex'>
                <Link href="/events/create">
                    Create new events
                </Link>
            </Button>
        </div>
    </section>

    <section className='wrapper my-8'>
    <Collection
          data={organizedEvent?.data}
          emptyTitle='No event have been created yet'
          emptyStateSubtext="Go create some now ! "
          collectionType='Event_Organized'
          limit={6}
          page={eventsPage}
          urlParamName='eventsPage'
          totalPages={organizedEvent?.totalPages}
        />
    </section>
    </>
  )
}

export default ProfilePage