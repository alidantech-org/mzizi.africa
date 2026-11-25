import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/finance/appropriations.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/legislature/bills.dart';
import 'package:mzizi_api/src/models/politics/commitments.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'fulfilments.g.dart';

/// What delivered (or contradicts) a commitment: a project, contract, appropriation, bill or law.
@JsonSerializable(includeIfNull: false)
class PoliticsFulfilments {
  const PoliticsFulfilments({
    this.appropriationId,
    this.billId,
    required this.commitmentId,
    this.contractId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.instrumentId,
    required this.kindTerm,
    this.projectId,
    this.recordedOn,
    required this.statusTerm,
    required this.updatedAt,
    required this.version,
  });
  final String? appropriationId;
  final String? billId;
  final String commitmentId;
  final String? contractId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? instrumentId;
  final String kindTerm;
  final String? projectId;
  final DateTime? recordedOn;
  final String statusTerm;
  final DateTime updatedAt;
  final int version;

  factory PoliticsFulfilments.fromJson(Map<String, dynamic> json) => _$PoliticsFulfilmentsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsFulfilmentsToJson(this);
}
