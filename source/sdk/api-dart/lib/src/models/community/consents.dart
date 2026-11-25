import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/community/actors.dart';
import 'package:mzizi_api/src/models/product/keys.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'consents.g.dart';

/// A consent an actor gave or withdrew, with the exact text version.
@JsonSerializable(includeIfNull: false)
class CommunityConsents {
  const CommunityConsents({
    required this.actorId,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.givenAt,
    required this.id,
    required this.keyId,
    required this.purposeTerm,
    required this.textVersion,
    required this.updatedAt,
    required this.version,
    this.withdrawnAt,
  });
  final String actorId;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime givenAt;
  final String id;
  final String keyId;
  final String purposeTerm;
  final String textVersion;
  final DateTime updatedAt;
  final int version;
  final DateTime? withdrawnAt;

  factory CommunityConsents.fromJson(Map<String, dynamic> json) => _$CommunityConsentsFromJson(json);

  Map<String, dynamic> toJson() => _$CommunityConsentsToJson(this);
}
