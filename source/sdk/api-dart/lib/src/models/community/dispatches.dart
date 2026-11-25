import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/dispatch_state.dart';
import 'package:mzizi_api/src/models/community/devices.dart';
import 'package:mzizi_api/src/models/community/notifications.dart';
import 'package:mzizi_api/src/models/community/subscriptions.dart';
import 'package:mzizi_api/src/models/shared/partitioned_record.dart';

part 'dispatches.g.dart';

/// One sending of a notification to one device; partitioned by month.
@JsonSerializable(includeIfNull: false)
class CommunityDispatches {
  const CommunityDispatches({
    required this.createdAt,
    required this.deviceId,
    required this.id,
    required this.notificationCreatedAt,
    required this.notificationId,
    this.openedAt,
    this.sentAt,
    required this.state,
    required this.subscriptionId,
  });
  final DateTime createdAt;
  final String deviceId;
  final String id;
  final DateTime notificationCreatedAt;
  final String notificationId;
  final DateTime? openedAt;
  final DateTime? sentAt;
  final CommunityDispatchState state;
  final String subscriptionId;

  factory CommunityDispatches.fromJson(Map<String, dynamic> json) => _$CommunityDispatchesFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityDispatchesToJson(this);
}
