import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private usersService: UsersService,
  ) {}

  async createNotification(data: {
    user_id: string;
    type: string;
    title: string;
    message: string;
    metadata?: any;
    action_url?: string;
    sendEmail?: boolean;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata,
      action_url: data.action_url,
    });

    await this.notificationRepository.save(notification);

    // Send email if requested
    if (data.sendEmail) {
      await this.sendEmailNotification(data.user_id, notification);
    }

    return notification;
  }

  async getNotifications(
    userId: string,
    query: any,
  ): Promise<{ notifications: Notification[]; total: number; unread: number }> {
    const { page = 1, limit = 20, read } = query;
    const skip = (page - 1) * limit;

    const where: any = { user_id: userId };
    if (read !== undefined) {
      where.is_read = read === 'true';
    }

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    const unread = await this.notificationRepository.count({
      where: { user_id: userId, is_read: false },
    });

    return { notifications, total, unread };
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepository.count({
      where: { user_id: userId, is_read: false },
    });

    return { count };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to access this notification');
    }

    notification.is_read = true;
    notification.read_at = new Date();

    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    const result = await this.notificationRepository.update(
      { user_id: userId, is_read: false },
      { is_read: true, read_at: new Date() },
    );

    return { count: result.affected || 0 };
  }

  async deleteNotification(id: string, userId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.user_id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this notification');
    }

    await this.notificationRepository.remove(notification);
  }

  async deleteAll(userId: string): Promise<{ count: number }> {
    const result = await this.notificationRepository.delete({
      user_id: userId,
    });

    return { count: result.affected || 0 };
  }

  // ========== Email Notifications ==========

  async sendEmailNotification(userId: string, notification: Notification): Promise<void> {
    try {
      const user = await this.usersService.findById(userId);

      // In production, implement actual email sending via SMTP/SendGrid
      console.log(`📧 Email sent to ${user.email}`);
      console.log(`Subject: ${notification.title}`);
      console.log(`Body: ${notification.message}`);

      // Mark email as sent
      notification.is_email_sent = true;
      notification.email_sent_at = new Date();
      await this.notificationRepository.save(notification);
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  // ========== Helper Methods for Different Notification Types ==========

  async sendTournamentStarted(userId: string, tournamentData: any): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'TOURNAMENT_STARTED',
      title: 'Tournament Started! 🏆',
      message: `The tournament "${tournamentData.title}" has started. Good luck!`,
      metadata: { tournament_id: tournamentData.id },
      action_url: `/tournaments/${tournamentData.id}`,
      sendEmail: true,
    });
  }

  async sendTournamentRegistration(userId: string, tournamentData: any): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'TOURNAMENT_REGISTERED',
      title: 'Tournament Registration Confirmed',
      message: `Your team has been registered for "${tournamentData.title}".`,
      metadata: { tournament_id: tournamentData.id },
      action_url: `/tournaments/${tournamentData.id}`,
    });
  }

  async sendVerificationCompleted(userId: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    const title = status === 'APPROVED' ? 'Profile Verified! ✅' : 'Profile Verification Failed ❌';
    const message = status === 'APPROVED'
      ? 'Your PUBG profile has been verified successfully. You can now join tournaments!'
      : 'Your PUBG profile verification was rejected. Please submit the correct details.';

    await this.createNotification({
      user_id: userId,
      type: 'VERIFICATION_COMPLETED',
      title,
      message,
      action_url: '/dashboard/profile',
      sendEmail: true,
    });
  }

  async sendRoomReleased(userId: string, matchData: any): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'ROOM_RELEASED',
      title: 'Match Room Released! 🎮',
      message: `Room ID: ${matchData.room_id} | Password: ${matchData.room_password}`,
      metadata: { match_id: matchData.id, room_id: matchData.room_id },
      action_url: `/matches/${matchData.id}`,
      sendEmail: true,
    });
  }

  async sendResultPublished(userId: string, matchData: any): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'RESULT_PUBLISHED',
      title: 'Match Results Published 📊',
      message: `Results for match #${matchData.match_number} are now available.`,
      metadata: { match_id: matchData.id },
      action_url: `/matches/${matchData.id}`,
    });
  }

  async sendPrizeSent(userId: string, amount: number, tournamentData: any): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'PRIZE_SENT',
      title: 'Prize Received! 🎉',
      message: `You have received $${amount} from tournament "${tournamentData.title}"`,
      metadata: { tournament_id: tournamentData.id, amount },
      action_url: '/dashboard/wallet',
      sendEmail: true,
    });
  }

  async sendTeamInvite(userId: string, teamData: any, inviterName: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'TEAM_INVITE',
      title: 'Team Invitation! 👥',
      message: `${inviterName} has invited you to join team "${teamData.name}"`,
      metadata: { team_id: teamData.id },
      action_url: `/dashboard/team`,
      sendEmail: true,
    });
  }

  async sendWithdrawalStatus(userId: string, withdrawalData: any): Promise<void> {
    const statusMap: Record<string, { title: string; message: string }> = {
      PROCESSING: {
        title: 'Withdrawal Processing ⏳',
        message: `Your withdrawal of $${withdrawalData.amount} is being processed.`,
      },
      COMPLETED: {
        title: 'Withdrawal Completed ✅',
        message: `Your withdrawal of $${withdrawalData.amount} has been sent to your bank.`,
      },
      REJECTED: {
        title: 'Withdrawal Rejected ❌',
        message: `Your withdrawal of $${withdrawalData.amount} was rejected. Reason: ${withdrawalData.rejected_reason || 'Contact support for details.'}`,
      },
    };

    const status = statusMap[withdrawalData.status];
    if (status) {
      await this.createNotification({
        user_id: userId,
        type: 'WITHDRAWAL_STATUS',
        title: status.title,
        message: status.message,
        metadata: { withdrawal_id: withdrawalData.id },
        action_url: '/dashboard/wallet',
        sendEmail: true,
      });
    }
  }

  async sendTournamentCancelled(userId: string, tournamentData: any): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'TOURNAMENT_CANCELLED',
      title: 'Tournament Cancelled ⚠️',
      message: `The tournament "${tournamentData.title}" has been cancelled. Your entry fee has been refunded.`,
      metadata: { tournament_id: tournamentData.id },
      action_url: `/tournaments`,
      sendEmail: true,
    });
  }

  async sendMatchReminder(userId: string, matchData: any): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'MATCH_REMINDER',
      title: 'Match Starting Soon! ⏰',
      message: `Match #${matchData.match_number} starts in 30 minutes. Be ready!`,
      metadata: { match_id: matchData.id },
      action_url: `/matches/${matchData.id}`,
      sendEmail: true,
    });
  }

  async sendTeamMemberJoined(userId: string, teamData: any, playerName: string): Promise<void> {
    await this.createNotification({
      user_id: userId,
      type: 'TEAM_MEMBER_JOINED',
      title: 'New Team Member! 👋',
      message: `${playerName} has joined team "${teamData.name}"`,
      metadata: { team_id: teamData.id },
      action_url: `/dashboard/team`,
    });
  }
}
