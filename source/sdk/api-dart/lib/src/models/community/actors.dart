import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/community/actor_kind.dart';
import 'package:mzizi_api/src/enums/community/actor_status.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/media/assets.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'actors.g.dart';

/// A visitor or member; a member's public profile. Members are not identities.
@JsonSerializable(includeIfNull: false)
class CommunityActors {
  const CommunityActors({
    this.accountId,
    this.avatarId,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.displayName,
    required this.firstSeenAt,
    this.handle,
    required this.id,
    required this.kind,
    this.languageId,
    required this.lastSeenAt,
    required this.status,
    required this.updatedAt,
    required this.version,
  });
  final String? accountId;
  final String? avatarId;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? displayName;
  final DateTime firstSeenAt;
  final String? handle;
  final String id;
  final CommunityActorKind kind;
  final String? languageId;
  final DateTime lastSeenAt;
  final CommunityActorStatus status;
  final DateTime updatedAt;
  final int version;

  factory CommunityActors.fromJson(Map<String, dynamic> json) => _$CommunityActorsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityActorsToJson(this);
}
