import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/locality/evidence_ref.dart';
import 'package:mzizi_api/src/models/locality/media_ref.dart';

part 'office_holder.g.dart';

/// Office Holder
@JsonSerializable(includeIfNull: false)
class LocalityOfficeHolder {
  const LocalityOfficeHolder({
    required this.evidence,
    required this.holderId,
    this.leftOfficeOn,
    required this.officeCode,
    required this.officeTitle,
    this.partyName,
    required this.personName,
    this.portrait,
    this.tookOfficeOn,
    this.unitFeatureId,
    this.unitName,
  });
  final List<LocalityEvidenceRef> evidence;
  final String holderId;
  final DateTime? leftOfficeOn;
  final String officeCode;
  final String officeTitle;
  final String? partyName;
  final String personName;
  final LocalityMediaRef? portrait;
  final DateTime? tookOfficeOn;
  final String? unitFeatureId;
  final String? unitName;

  factory LocalityOfficeHolder.fromJson(Map<String, dynamic> json) => _$LocalityOfficeHolderFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityOfficeHolderToJson(this);
}
