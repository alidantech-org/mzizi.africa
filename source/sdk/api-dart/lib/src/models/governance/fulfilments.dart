import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/finance/appropriations.dart';
import 'package:mzizi_api/src/models/governance/bills.dart';
import 'package:mzizi_api/src/models/governance/promises.dart';
import 'package:mzizi_api/src/models/legal/instruments.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'fulfilments.g.dart';

/// A recorded link from a promise to what delivered it, with how the link was made and whether it is reviewed.
@JsonSerializable(includeIfNull: false)
class GovernanceFulfilments {
  const GovernanceFulfilments({
    this.appropriationId,
    this.billId,
    this.contractId,
    required this.createdAt,
    this.deletedAt,
    required this.evidenceStatusId,
    required this.id,
    this.instrumentId,
    required this.kindId,
    this.projectId,
    required this.promiseId,
    required this.recordedOn,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final String? appropriationId;
  final String? billId;
  final String? contractId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String evidenceStatusId;
  final String id;
  final String? instrumentId;
  final String kindId;
  final String? projectId;
  final String promiseId;
  final DateTime recordedOn;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceFulfilments.fromJson(Map<String, dynamic> json) => _$GovernanceFulfilmentsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceFulfilmentsToJson(this);
}
