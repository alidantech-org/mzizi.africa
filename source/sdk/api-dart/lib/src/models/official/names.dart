import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/validity_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'names.g.dart';

/// One attested name form for exactly one entity or individual, with optional language and validity.
@JsonSerializable(includeIfNull: false)
class OfficialNames {
  const OfficialNames({
    required this.createdAt,
    this.deletedAt,
    this.entityId,
    required this.id,
    this.individualId,
    required this.isPreferred,
    this.languageTag,
    required this.name,
    required this.nameKindId,
    this.sourceCitationId,
    required this.updatedAt,
    this.validFrom,
    this.validUntil,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? entityId;
  final String id;
  final String? individualId;
  final bool isPreferred;
  final String? languageTag;
  final String name;
  final String nameKindId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validUntil;
  final int version;

  factory OfficialNames.fromJson(Map<String, dynamic> json) => _$OfficialNamesFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialNamesToJson(this);
}
