import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'bill_window.g.dart';

/// Bill Window
@JsonSerializable(includeIfNull: false)
class LegislatureBillWindow {
  const LegislatureBillWindow({required this.institutionId, this.limit, this.offset, this.statusTerm});
  final String institutionId;
  final int? limit;
  final int? offset;
  final String? statusTerm;

  factory LegislatureBillWindow.fromJson(Map<String, dynamic> json) => _$LegislatureBillWindowFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureBillWindowToJson(this);
}
