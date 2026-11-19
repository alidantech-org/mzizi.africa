import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/reference/template_product.dart';
import 'package:mzizi_api/src/models/geography/levels.dart';
import 'package:mzizi_api/src/models/reference/pattern.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'template.g.dart';

/// One thing a pattern produces, how many (one per unit of a level), how it is named and coded, and the attributes it carries. Templates generate structure only, never people.
@JsonSerializable(includeIfNull: false)
class ReferenceTemplate {
  const ReferenceTemplate({
    this.armId,
    this.classId,
    required this.code,
    required this.codeTemplate,
    required this.createdAt,
    this.deletedAt,
    this.fanOutLevelId,
    required this.id,
    this.institutionKindId,
    required this.nameTemplate,
    this.parentTemplateId,
    required this.patternId,
    required this.produces,
    this.roleId,
    this.seatBasisId,
    this.seatCount,
    this.selectionMethodId,
    this.sourceCitationId,
    this.termLimit,
    this.termYears,
    required this.updatedAt,
    required this.version,
  });
  final String? armId;
  final String? classId;
  final String code;
  final String codeTemplate;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? fanOutLevelId;
  final String id;
  final String? institutionKindId;
  final String nameTemplate;
  final String? parentTemplateId;
  final String patternId;
  final ReferenceTemplateProduct produces;
  final String? roleId;
  final String? seatBasisId;
  final int? seatCount;
  final String? selectionMethodId;
  final String? sourceCitationId;
  final int? termLimit;
  final int? termYears;
  final DateTime updatedAt;
  final int version;

  factory ReferenceTemplate.fromJson(Map<String, dynamic> json) => _$ReferenceTemplateFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceTemplateToJson(this);
}
