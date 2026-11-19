import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/topic.dart';
import 'package:mzizi_api/src/models/shared/coded_period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'functions.g.dart';

/// A public function that a constitution or law assigns to a level of government. Its name and plain wording are copy keyed by code.
@JsonSerializable(includeIfNull: false)
class GovernanceFunctions {
  const GovernanceFunctions({
    this.basisProvisionId,
    required this.code,
    required this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    this.parentFunctionId,
    this.sourceCitationId,
    this.toYear,
    this.topicId,
    required this.updatedAt,
    required this.version,
  });
  final String? basisProvisionId;
  final String code;
  final String countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String? parentFunctionId;
  final String? sourceCitationId;
  final int? toYear;
  final String? topicId;
  final DateTime updatedAt;
  final int version;

  factory GovernanceFunctions.fromJson(Map<String, dynamic> json) => _$GovernanceFunctionsFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceFunctionsToJson(this);
}
