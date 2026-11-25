import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'collections.g.dart';

/// The programme that produced figures (census 2019, KDHS 2022, WDI).
@JsonSerializable(includeIfNull: false)
class StatisticsCollections {
  const StatisticsCollections({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityKind,
    required this.kindTerm,
    this.stewardId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String kindTerm;
  final String? stewardId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory StatisticsCollections.fromJson(Map<String, dynamic> json) => _$StatisticsCollectionsFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsCollectionsToJson(this);
}
