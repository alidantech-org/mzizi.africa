import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/governance/template_product.dart';
import 'package:mzizi_api/src/models/governance/patterns.dart';
import 'package:mzizi_api/src/models/reference/levels.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'templates.g.dart';

/// One thing a pattern produces, how many, how it is named and coded. Templates generate structure only, never people.
@JsonSerializable(includeIfNull: false)
class GovernanceTemplates {
  const GovernanceTemplates({
    this.armTerm,
    this.basisTerm,
    this.classTerm,
    required this.code,
    required this.codeTemplate,
    required this.createdAt,
    this.deletedAt,
    this.fanOutLevelId,
    required this.id,
    this.kindTerm,
    this.methodTerm,
    required this.nameTemplate,
    this.parentTemplateId,
    required this.patternId,
    required this.produces,
    this.roleTerm,
    this.seatCount,
    this.termLimit,
    this.termYears,
    required this.updatedAt,
    required this.version,
  });
  final String? armTerm;
  final String? basisTerm;
  final String? classTerm;
  final String code;
  final String codeTemplate;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? fanOutLevelId;
  final String id;
  final String? kindTerm;
  final String? methodTerm;
  final String nameTemplate;
  final String? parentTemplateId;
  final String patternId;
  final GovernanceTemplateProduct produces;
  final String? roleTerm;
  final int? seatCount;
  final int? termLimit;
  final int? termYears;
  final DateTime updatedAt;
  final int version;

  factory GovernanceTemplates.fromJson(Map<String, dynamic> json) => _$GovernanceTemplatesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceTemplatesToJson(this);
}
