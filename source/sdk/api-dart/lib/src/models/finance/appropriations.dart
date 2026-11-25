import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/finance/revisions.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'appropriations.g.dart';

/// A line of a budget revision: money voted to a recipient, programme, project or place.
@JsonSerializable(includeIfNull: false)
class FinanceAppropriations {
  const FinanceAppropriations({
    this.amount,
    required this.classTerm,
    required this.code,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    this.featureId,
    required this.id,
    this.parentId,
    this.projectId,
    this.recipientId,
    required this.revisionId,
    required this.updatedAt,
    required this.version,
  });
  final int? amount;
  final String classTerm;
  final String code;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String? featureId;
  final String id;
  final String? parentId;
  final String? projectId;
  final String? recipientId;
  final String revisionId;
  final DateTime updatedAt;
  final int version;

  factory FinanceAppropriations.fromJson(Map<String, dynamic> json) => _$FinanceAppropriationsFromJson(json);

  Map<String, dynamic> toJson() => _$FinanceAppropriationsToJson(this);
}
