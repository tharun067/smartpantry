import { connectToDB } from '@/config/db';
import Container from '@/models/container';
import Notification from '@/models/Notifications';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectToDB();

  try {
    const { searchParams } = new URL(request.url);
    const householdId = searchParams.get('householdId');
    const memberId = searchParams.get('memberId');

    if (!householdId) {
      return NextResponse.json({ error: 'Household ID is required' }, { status: 400 });
    }

    // Fetch all containers for the household
    const containers = await Container.find({ householdId });

    // Filter containers where currentWeight is below alertWeight
    const lowWeightContainers = containers.filter(container => {
      const currentWeight = parseFloat(container.currentWeight.toString());  // Convert Decimal128 to Number
      const alertWeight = parseFloat(container.alertWeight.toString());  // Convert Decimal128 to Number
      return currentWeight < alertWeight;
    });
    let notifications = [];

    // Generate notifications for low-weight containers
    for (const container of lowWeightContainers) {
      const existingNotification = await Notification.findOne({
        householdId,
        'metadata.containerId': container._id,
        isRead: false
      });

      if (!existingNotification) {
        const newNotification = new Notification({
          householdId,
          memberId,
          message: `Container "${container.productId}" is running low!`,
          type: 'alert',
          isRead: false,
          metadata: {
            containerId: container._id,
            productId: container.productId,
            currentWeight: parseFloat(container.currentWeight.toString()),
            unit: container.unit,
          }
        });

        await newNotification.save();
        notifications.push(newNotification);
        console.log('Saved new notification:', newNotification);
      } else {
        notifications.push(existingNotification);
      }
    }

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('GET notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function PUT(request) {
  await connectToDB();

  try {
    const { notificationId } = await request.json();

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('PUT notification error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(request) {
  await connectToDB();

  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('notificationId');

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    await Notification.findByIdAndDelete(notificationId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE notification error:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
