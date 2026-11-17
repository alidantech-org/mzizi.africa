import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'entities.g.dart';

/// Stable identity for one organization or legally identified entity; its names are stored in official.names.
@JsonSerializable(includeIfNull: false)
class OfficialEntities {
  const OfficialEntities({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.dissolvedOn,
    required this.id,
    required this.kindId,
    this.registeredOn,
    this.registrationCountryId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? dissolvedOn;
  final String id;
  final String kindId;
  final DateTime? registeredOn;
  final String? registrationCountryId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory OfficialEntities.fromJson(Map<String, dynamic> json) => _$OfficialEntitiesFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialEntitiesToJson(this);
}
