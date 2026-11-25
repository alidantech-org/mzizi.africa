import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/election/form_status.dart';
import 'package:mzizi_api/src/models/election/contests.dart';
import 'package:mzizi_api/src/models/election/stations.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/media/assets.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'forms.g.dart';

/// An original results document, so a reader can open the form behind any result.
@JsonSerializable(includeIfNull: false)
class ElectionForms {
  const ElectionForms({
    required this.assetId,
    required this.contestId,
    required this.createdAt,
    this.deletedAt,
    this.featureId,
    required this.formTerm,
    required this.id,
    this.publishedOn,
    this.stationId,
    required this.status,
    required this.updatedAt,
    required this.version,
  });
  final String assetId;
  final String contestId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? featureId;
  final String formTerm;
  final String id;
  final DateTime? publishedOn;
  final String? stationId;
  final ElectionFormStatus status;
  final DateTime updatedAt;
  final int version;

  factory ElectionForms.fromJson(Map<String, dynamic> json) => _$ElectionFormsFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionFormsToJson(this);
}
