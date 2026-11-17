import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'names.g.dart';

/// One attested name form for exactly one entity or individual, with its language (`mul` or `und` when none applies) and validity.
@JsonSerializable(includeIfNull: false)
class OfficialNames {
  const OfficialNames({
    required this.createdAt,
    this.deletedAt,
    this.entityId,
    required this.id,
    this.individualId,
    required this.isPreferred,
    required this.languageId,
    required this.name,
    required this.nameKindId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? entityId;
  final String id;
  final String? individualId;
  final bool isPreferred;
  final String languageId;
  final String name;
  final String nameKindId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory OfficialNames.fromJson(Map<String, dynamic> json) => _$OfficialNamesFromJson(json);

  Map<String, dynamic> toJson() => _$OfficialNamesToJson(this);
}
