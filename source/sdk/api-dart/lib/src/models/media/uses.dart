import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/media/assets.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'uses.g.dart';

/// Which named thing an asset illustrates and why (Nairobi ← photo, skyline).
@JsonSerializable(includeIfNull: false)
class MediaUses {
  const MediaUses({
    required this.assetId,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityId,
    this.position,
    required this.purposeTerm,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String assetId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final String identityId;
  final int? position;
  final String purposeTerm;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory MediaUses.fromJson(Map<String, dynamic> json) => _$MediaUsesFromJson(json);

  Map<String, dynamic> toJson() => _$MediaUsesToJson(this);
}
