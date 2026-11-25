import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/community/actors.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'subscriptions.g.dart';

/// A named thing an actor follows.
@JsonSerializable(includeIfNull: false)
class CommunitySubscriptions {
  const CommunitySubscriptions({
    required this.actorId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityId,
    required this.kindTerm,
    this.revokedAt,
    required this.updatedAt,
    required this.version,
  });
  final String actorId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String identityId;
  final String kindTerm;
  final DateTime? revokedAt;
  final DateTime updatedAt;
  final int version;

  factory CommunitySubscriptions.fromJson(Map<String, dynamic> json) => _$CommunitySubscriptionsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunitySubscriptionsToJson(this);
}
