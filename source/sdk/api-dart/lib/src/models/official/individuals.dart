import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'individuals.g.dart';

/// One real human identity; names, identifiers and contacts are normalized in shared tables.
@JsonSerializable(includeIfNull: false)
class OfficialIndividuals {
  const OfficialIndividuals({
    this.birthDate,
    required this.code,
    required this.createdAt,
    this.deathDate,
    this.deletedAt,
    required this.id,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? birthDate;
  final String code;
  final DateTime createdAt;
  final DateTime? deathDate;
  final DateTime? deletedAt;
  final String id;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory OfficialIndividuals.fromJson(Map<String, dynamic> json) => _$OfficialIndividualsFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialIndividualsToJson(this);
}
