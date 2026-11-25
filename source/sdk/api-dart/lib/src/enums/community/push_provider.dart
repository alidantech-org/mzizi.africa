import 'package:json_annotation/json_annotation.dart';

/// Push Provider
enum CommunityPushProvider {
  @JsonValue('apns')
  apns,
  @JsonValue('fcm')
  fcm,
  @JsonValue('onesignal')
  onesignal,
}
