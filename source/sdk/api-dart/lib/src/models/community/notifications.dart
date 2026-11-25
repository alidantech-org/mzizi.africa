import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/product/keys.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/partitioned_record.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'notifications.g.dart';

/// A notification to send; partitioned by month of creation.
@JsonSerializable(includeIfNull: false)
class CommunityNotifications {
  const CommunityNotifications({
    required this.createdAt,
    required this.id,
    this.identityId,
    required this.keyId,
    required this.kindTerm,
    this.occurrenceId,
    this.postCountryId,
    this.postId,
  });
  final DateTime createdAt;
  final String id;
  final String? identityId;
  final String keyId;
  final String kindTerm;
  final String? occurrenceId;
  final String? postCountryId;
  final String? postId;

  factory CommunityNotifications.fromJson(Map<String, dynamic> json) => _$CommunityNotificationsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityNotificationsToJson(this);
}
