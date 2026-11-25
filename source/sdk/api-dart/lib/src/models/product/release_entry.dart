import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/product/release_status.dart';

part 'release_entry.g.dart';

/// Release Entry
@JsonSerializable(includeIfNull: false)
class ProductReleaseEntry {
  const ProductReleaseEntry({
    required this.appCode,
    required this.countryCode,
    required this.countryId,
    this.fromOn,
    required this.releaseId,
    required this.status,
  });
  final String appCode;
  final String countryCode;
  final String countryId;
  final DateTime? fromOn;
  final String releaseId;
  final ProductReleaseStatus status;

  factory ProductReleaseEntry.fromJson(Map<String, dynamic> json) => _$ProductReleaseEntryFromJson(json);

  Map<String, dynamic> toJson() => _$ProductReleaseEntryToJson(this);
}
